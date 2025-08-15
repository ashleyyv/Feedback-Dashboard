units_sold = 750
price_per_unit = 15.50
cost_per_unit = 9.25

def calculate_revenue(units, price):
    return units * price

def calculate_profit_margin(units, price, cost):
    revenue = units * price
    total_cost = units * cost
    profit = revenue - total_cost

    if revenue == 0:
        return 0.0
    else:
        profit_margin = (profit / revenue) * 100
        return profit_margin

revenue_goal = 10000.00

actual_revenue = calculate_revenue(units_sold, price_per_unit)
actual_profit_margin = calculate_profit_margin(units_sold, price_per_unit, cost_per_unit)

goal_met = False
if actual_revenue >= revenue_goal:
    goal_met = True
    goal_status_message = "SUCCESS: Revenue goal has been met or exceeded!"
else:
    goal_status_message = "STATUS: Revenue goal was NOT met."

print("="*40)
print("       SALES PERFORMANCE REPORT       ")
print("="*40)
print(f"Units Sold:       {units_sold:,}")
print(f"Price per Unit:   ${price_per_unit:,.2f}")
print(f"Cost per Unit:    ${cost_per_unit:,.2f}")
print("-" * 40)
print(f"Total Revenue:    ${actual_revenue:,.2f}")
print(f"Revenue Goal:     ${revenue_goal:,.2f}")
print(f"Profit Margin:    {actual_profit_margin:.2f}%")
print("="*40)
print(goal_status_message)
if not goal_met:
    shortfall = revenue_goal - actual_revenue
    print(f"Revenue Shortfall: ${shortfall:,.2f}")
print("="*40)