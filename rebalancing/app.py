from flask import Flask, render_template, request
import pandas as pd
import plotly.express as px
import plotly.io as pio
import io

app = Flask(__name__)

def generate_pie_chart(df, names_col, values_col, title):
    fig = px.pie(df, names=names_col, values=values_col, title=title)
    return pio.to_html(fig, full_html=False, include_plotlyjs='cdn')

@app.route('/')
def index():
    return render_template('index.html')

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
        return render_template('result.html',
                               original_allocation=original_allocation,
                               return_based_rebalancing=return_based_rebalancing,
                               risk_based_rebalancing=risk_based_rebalancing,
                               original_pie_chart=original_pie_chart,
                               return_pie_chart=return_pie_chart,
                               risk_pie_chart=risk_pie_chart)
    else:
        return "No file uploaded"

if __name__ == '__main__':
    app.run(debug=True, port=4000)
