# Use a base image that supports Python 3.10
FROM python:3.10-slim-buster

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    zlib1g-dev \
    libncurses5-dev \
    libgdbm-dev \
    libnss3-dev \
    libssl-dev \
    libreadline-dev \
    libffi-dev \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
    && python3.10 get-pip.py \
    && rm get-pip.py

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Install required packages
RUN pip3.10 install --upgrade pip
RUN pip3.10 install yfinance==0.2.40 numpy==1.25.2 pandas==2.0.3 tensorflow==2.15.0 joblib==1.4.2 scikit-learn==1.2.2

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip3.10 install -r requirements.txt

# Copy file package.json and package-lock.json to working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy all files to working directory
COPY . .

# Expose port
EXPOSE 8080

# Command to run app
CMD ["node", "server.js"]