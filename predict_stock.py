import sys
import os
import yfinance as yf
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
import json

# Update the dictionary to include the models directory
ticker_to_model = {
    'BNB-USD': ('models/predict_bnb.h5', 6),
    'NEAR-USD': ('models/predict_near.h5', 13),
    'SOL-USD': ('models/predict_sol.h5', 13),
    'LINK-USD': ('models/predict_link.h5', 20),
    'ETH-USD': ('models/predict_eth.h5', 20),
    'BBCA.JK': ('models/predict_bbca.h5', 6),
    'BBRI.JK': ('models/predict_bbri.h5', 6),
    # 'INDF.JK': ('models/predict_indf.h5', 13),
    'TLKM.JK': ('models/predict_tlkm.h5', 6),
    'AMZN': ('models/predict_amzn.h5', 6),
}

def prepare_input_data(ticker, end_date, n_steps):
    stock_data = yf.download(ticker, end=end_date)
    X_feat = stock_data[['Open', 'High', 'Low']]
    target_y = stock_data['Close']

    sc = joblib.load('standard_scaler.pkl')
    X_ft = sc.fit_transform(X_feat.values)
    stock_data_ft = pd.DataFrame(columns=X_feat.columns, data=X_ft, index=X_feat.index)
    stock_data_ft['Close'] = target_y.values

    input_data = stock_data_ft.values[-n_steps:, :-1]
    input_data = np.expand_dims(input_data, axis=0)

    return input_data, stock_data_ft.index[-1], sc

def predict_stock_price(ticker, end_date):
    model_name, n_steps = ticker_to_model[ticker]
    model = load_model(model_name)

    input_data, last_date, sc = prepare_input_data(ticker, end_date, n_steps)

    predicted_price_scaled = model.predict(input_data).flatten()[0]

    predicted_price = sc.inverse_transform([[np.nan, predicted_price_scaled, np.nan]])[0][1]

    return predicted_price

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict_stock.py <end_date>")
        sys.exit(1)

    end_date = sys.argv[1]

    results = {}
    for ticker in ticker_to_model:
        try:
            predicted_price = predict_stock_price(ticker, end_date)
            results[ticker] = predicted_price
        except FileNotFoundError as e:
            results[ticker] = f"Error: Model file not found for {ticker}"
        except Exception as e:
            results[ticker] = f"Error: {str(e)}"

    print(json.dumps(results))