from flask import Flask, render_template, request
import yfinance as yf
import numpy as np
import plotly.graph_objects as go

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    ticker = request.form['ticker'].upper()
    if ticker:
        # Get real-time stock info using yfinance
        stock = yf.Ticker(ticker)
        df = stock.history(period="1y")

        # Calculate daily returns
        df['Returns'] = df['Close'].pct_change()

        # Calculate the mean (mu) and standard deviation (sigma) of daily returns
        mu = df['Returns'].mean()
        sigma = df['Returns'].std()

        # Use the last available close price as initial price
        initial_price = df['Close'].iloc[-1]

        # Number of days and simulations
        days = 250  # Default days
        simulations = 1000  # Default simulations

        # Monte Carlo simulation function
        def monte_carlo_simulation(start_price, mu, sigma, days, simulations):
            dt = 1
            results = np.zeros((days+1, simulations))
            results[0] = start_price

            for t in range(1, days + 1):
                shock = np.random.normal(loc=mu * dt, scale=sigma * np.sqrt(dt), size=simulations)
                results[t] = results[t - 1] * np.exp(shock)

            return results

        # Run simulation
        results = monte_carlo_simulation(initial_price, mu, sigma, days, simulations)

        # Visualization
        fig = go.Figure()
        for i in range(simulations):
            fig.add_trace(go.Scatter(x=np.arange(days + 1), y=results[:, i], mode='lines', opacity=0.5, showlegend=False))
        # Unreliable region (0 to 30 days)
        fig.add_vrect(x0=0, x1=30, fillcolor="red", opacity=0.3, layer="below", line_width=0, annotation_text="Unreliable", annotation_position="top left")

        # Transition phase region (30 to 210 days)
        fig.add_vrect(x0=30, x1=210, fillcolor="yellow", opacity=0.3, layer="below", line_width=0, annotation_text="Transition Phase", annotation_position="top left")

        # Reliable region (210+ days)
        fig.add_vrect(x0=210, x1=days, fillcolor="green", opacity=0.3, layer="below", line_width=0, annotation_text="Reliable", annotation_position="top left")

        # Update layout and regions as needed...
        fig.update_layout(title=f'Monte Carlo Simulation Results for {ticker}', xaxis_title='Days', yaxis_title='Simulated Price')
        plot_html = fig.to_html(full_html=False, include_plotlyjs='cdn')

        average_predicted_close = np.mean(results[-1])
        return render_template('result.html', plot_html=plot_html, ticker=ticker, average_predicted_close=average_predicted_close)
    else:
        return "No ticker provided"

if __name__ == '__main__':
    app.run(debug=True)
