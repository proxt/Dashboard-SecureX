-- Create the sales_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS sales_stats (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purchases_today INTEGER DEFAULT 0,
    purchases_month INTEGER DEFAULT 0,
    purchases_total INTEGER DEFAULT 0,
    earned_last_month DECIMAL(10,2) DEFAULT 0.00,
    earned_this_month DECIMAL(10,2) DEFAULT 0.00,
    earned_total DECIMAL(10,2) DEFAULT 0.00,
    net_last_month DECIMAL(10,2) DEFAULT 0.00,
    net_this_month DECIMAL(10,2) DEFAULT 0.00,
    net_total DECIMAL(10,2) DEFAULT 0.00,
    payout_sellers_last_month DECIMAL(10,2) DEFAULT 0.00
);

-- Insert sample data for testing
INSERT INTO sales_stats (
    purchases_today,
    purchases_month,
    purchases_total,
    earned_last_month,
    earned_this_month,
    earned_total,
    net_last_month,
    net_this_month,
    net_total,
    payout_sellers_last_month
) VALUES (
    45,
    1250,
    15780,
    125000.50,
    89750.25,
    2450000.75,
    95000.40,
    68200.20,
    1960000.60,
    30000.10
);
