from flask import Flask, request, jsonify, render_template
from urllib.parse import quote
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices
import yfinance as yf
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize_portfolio', methods=['POST'])
def optimize_portfolio():
    start_date = request.form['start_date']
    end_date = request.form['end_date']
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.root_path, filename)
        file.save(file_path)

        # Read the uploaded CSV file into a DataFrame
        dataset = pd.read_csv(file_path)
        dataset['Ticker'] = dataset['Ticker'] + '.NS'

        os.remove(file_path)  # Delete the uploaded file

        tickers = dataset['Ticker'].tolist()
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

        # Fetch stock prices
        stock_prices = fetch_stock_prices(tickers, start_date, end_date)
        stock_prices_df = pd.DataFrame(stock_prices)

        # Calculate expected returns and sample covariance
        mu = expected_returns.mean_historical_return(stock_prices_df)
        S = risk_models.sample_cov(stock_prices_df)

        # Optimize portfolio for maximal Sharpe ratio
        ef = EfficientFrontier(mu, S)
        weights = ef.max_sharpe(risk_free_rate=0.05)
        cleaned_weights = ef.clean_weights()
        expected_return, volatility, sharpe_ratio = ef.portfolio_performance(risk_free_rate=0.05)

        # Allocate portfolio value
        latest_prices = get_latest_prices(stock_prices_df)
        da = DiscreteAllocation(weights, latest_prices)
        allocation, leftover = da.lp_portfolio()

        cleaned_weights = {str(key): float(value) for key, value in cleaned_weights.items()}
        allocation = {str(key): int(value) for key, value in allocation.items()}

        result = {
            'weights': cleaned_weights,
            'expected_return': expected_return,
            'volatility': volatility,
            'sharpe_ratio': sharpe_ratio,
            'allocation': allocation,
            'leftover': leftover
        }

        return render_template('result.html', **result)
    else:
        return jsonify({'error': 'File extension not allowed'}), 400

def fetch_stock_prices(tickers, start_date, end_date):
    stock_data = {}
    for ticker in tickers:
        prices = yf.download(ticker, start=start_date, end=end_date)['Close']
        stock_data[ticker] = prices
    return stock_data

if __name__ == '__main__':
    app.run(debug=True, port=3000)