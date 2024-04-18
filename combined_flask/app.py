from flask import Flask, render_template, request, jsonify
import yfinance as yf
import numpy as np
import plotly.graph_objects as go
import pandas as pd
from urllib.parse import quote, unquote
from flask_cors import CORS
from flask_restful import Resource, Api
from pandas_datareader import data as pdr
from datetime import datetime
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices
from werkzeug.utils import secure_filename
import os
import json

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['UPLOAD_FOLDER'] = 'uploads/' #make a folder on your pc named uploads for this to work 
ALLOWED_EXTENSIONS = {'csv'}

dataset = pd.DataFrame()

def fetch_stock_prices(tickers, start_date, end_date):
    stock_data = {}
    for ticker in tickers:
        prices = yf.download(ticker, start=start_date, end=end_date)['Close']
        stock_data[ticker] = prices
    return stock_data

@app.route('/')
def index():
    return render_template('monty_index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    ticker = request.form['ticker'].upper()
    if ticker:
        stock = yf.Ticker(ticker)
        df = stock.history(period="1y")

        df['Returns'] = df['Close'].pct_change()

        mu = df['Returns'].mean()
        sigma = df['Returns'].std()

        initial_price = df['Close'].iloc[-1]

        days = 250  
        simulations = 1000  

        def monte_carlo_simulation(start_price, mu, sigma, days, simulations):
            dt = 1
            results = np.zeros((days+1, simulations))
            results[0] = start_price

            for t in range(1, days + 1):
                shock = np.random.normal(loc=mu * dt, scale=sigma * np.sqrt(dt), size=simulations)
                results[t] = results[t - 1] * np.exp(shock)

            return results

        results = monte_carlo_simulation(initial_price, mu, sigma, days, simulations)

        fig = go.Figure()
        for i in range(simulations):
            fig.add_trace(go.Scatter(x=np.arange(days + 1), y=results[:, i], mode='lines', opacity=0.5, showlegend=False))

        fig.add_vrect(x0=0, x1=30, fillcolor="red", opacity=0.3, layer="below", line_width=0, annotation_text="Unreliable", annotation_position="top left")

        fig.add_vrect(x0=30, x1=210, fillcolor="yellow", opacity=0.3, layer="below", line_width=0, annotation_text="Transition Phase", annotation_position="top left")

        fig.add_vrect(x0=210, x1=days, fillcolor="green", opacity=0.3, layer="below", line_width=0, annotation_text="Reliable", annotation_position="top left")

        fig.update_layout(title=f'Monte Carlo Simulation Results for {ticker}', xaxis_title='Days', yaxis_title='Simulated Price')
        plot_html = fig.to_html(full_html=False, include_plotlyjs='cdn')

        average_predicted_close = np.mean(results[-1])
        return render_template('monty_result.html', plot_html=plot_html, ticker=ticker, average_predicted_close=average_predicted_close)
    else:
        return "No ticker provided"

@app.route('/optimize_portfolio', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}),  400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}),  400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # Read the uploaded CSV file into a DataFrame
        global dataset
        dataset = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        dataset['Ticker'] = dataset['Ticker'] + '.NS'
        result = optimize_portfolio()
        return jsonify(result)

def optimize_portfolio():
    data = request.json
    tickers = dataset['Ticker'].tolist()
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')

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
    expected_return = float(expected_return)
    volatility = float(volatility)
    sharpe_ratio = float(sharpe_ratio)

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

    return result


def get_stocks(stocks):
    yf.pdr_override()
    returns = []
    end = datetime.now()
    start = datetime(end.year - 8, end.month, end.day)
    for stock in stocks:
        data = pdr.get_data_yahoo(stock, start=start, end=end)['Adj Close']
        pct_return = data.pct_change(fill_method=None)
        pct_return = pct_return.dropna()
        avg_return = pct_return.mean()
        std_dev = pct_return.std()
        risk_free_rate = 0.02
        sharpe_ratio = (avg_return - risk_free_rate) / std_dev
        returns.append(sharpe_ratio)
    return returns


class Stocks(Resource):
    def post(self):
        request_data = request.get_json()
        returns = get_stocks(request_data['stocks'])
        return returns, 200


api.add_resource(Stocks, '/stocks')

@app.route('/upload', methods=['POST'])
def upload():
    uploaded_file = request.files['file']
    if uploaded_file:
        data = pd.read_csv(uploaded_file)

        total_investment_returns_by_user = data.groupby('User_Id').agg({
            'Investment_Amount': 'sum',
            'Instrument_Returns': 'sum'
        }).reset_index()
        total_investment_returns_by_user['New_Investment_Amount'] = total_investment_returns_by_user['Investment_Amount'] + total_investment_returns_by_user['Instrument_Returns']

        total_returns_by_instrument = data.groupby('Investment_Instrument')['Instrument_Returns'].sum()

        base_weightage = 1 / len(total_returns_by_instrument)
        total_returns_sum = total_returns_by_instrument.sum()
        proportional_weightages = total_returns_by_instrument.apply(lambda x: base_weightage + (x / total_returns_sum))

        new_total_investment_amount = total_investment_returns_by_user.iloc[0]['New_Investment_Amount']
        new_investment_allocation = proportional_weightages * new_total_investment_amount

        instrument_volatility = data[['Investment_Instrument', 'Instrument_Volatility']].drop_duplicates().set_index('Investment_Instrument')['Instrument_Volatility']
        base_weightages = {'Low': 0.4, 'Medium': 0.3, 'High': 0.3}
        adjusted_base_weightages = instrument_volatility.map(base_weightages)
        total_adjusted_base_weightage = adjusted_base_weightages.sum()
        normalized_base_weightages = adjusted_base_weightages / total_adjusted_base_weightage
        adjusted_proportional_weightages = {}
        for instrument, returns in total_returns_by_instrument.items():
            base_weightage = normalized_base_weightages[instrument]
            adjusted_weightage = base_weightage + (returns / total_returns_sum)
            adjusted_proportional_weightages[instrument] = adjusted_weightage
        total_weightage = sum(adjusted_proportional_weightages.values())
        new_investment_allocation_adjusted = {instrument: weightage / total_weightage * new_total_investment_amount for instrument, weightage in adjusted_proportional_weightages.items()}

        user_id_of_interest = total_investment_returns_by_user.iloc[0]['User_Id']
        data_for_user = data[data['User_Id'] == user_id_of_interest]
        investment_by_instrument_for_user = data_for_user.groupby('Investment_Instrument')['Investment_Amount'].sum().reset_index()

        original_allocation = investment_by_instrument_for_user.to_html()
        return_based_rebalancing = pd.DataFrame(new_investment_allocation.items(), columns=['Instrument', 'Amount']).to_html()
        risk_based_rebalancing = pd.DataFrame(new_investment_allocation_adjusted.items(), columns=['Instrument', 'Amount']).to_html()

        original_pie_chart = generate_pie_chart(investment_by_instrument_for_user, 'Investment_Instrument', 'Investment_Amount', 'Original Allocation')
        return_pie_chart = generate_pie_chart(pd.DataFrame(new_investment_allocation.items(), columns=['Investment_Instrument', 'Amount']), 'Investment_Instrument', 'Amount', 'Return Based Rebalancing')
        risk_pie_chart = generate_pie_chart(pd.DataFrame(new_investment_allocation_adjusted.items(), columns=['Investment_Instrument', 'Amount']), 'Investment_Instrument', 'Amount', 'Risk Based Rebalancing')
        return render_template('rebalancing_result.html',
                               original_allocation=original_allocation,
                               return_based_rebalancing=return_based_rebalancing,
                               risk_based_rebalancing=risk_based_rebalancing,
                               original_pie_chart=original_pie_chart,
                               return_pie_chart=return_pie_chart,
                               risk_pie_chart=risk_pie_chart)
    else:
        return "No file uploaded"

def generate_pie_chart(df, names_col, values_col, title):
    fig = px.pie(df, names=names_col, values=values_col, title=title)
    return pio.to_html(fig, full_html=False, include_plotlyjs='cdn')

@app.route('/')
def index(): #might have to rename this function
    return render_template('rebalancing_index.html')

@app.route('/result')
def result():
    expected_return = float(request.args.get('expected_return'))
    volatility = float(request.args.get('volatility'))
    sharpe_ratio = float(request.args.get('sharpe_ratio'))
    allocation = json.loads(unquote(request.args.get('allocation')))
    leftover = float(request.args.get('leftover'))
    return render_template('optimize_result.html',
                           expected_return=expected_return,
                           volatility=volatility,
                           sharpe_ratio=sharpe_ratio,
                           allocation=allocation,
                           leftover=leftover)

@app.route('/optimize')
def optimize_index():
    return render_template('optimize_index.html')

if __name__ == '__main__':
    app.run(debug=True)
