import csv

# Wine Quality Classification (simplified)
X_wine = [
    [7.4, 0.70, 0.00, 1.9, 0.076],  # Features: acidity, sugar, pH, alcohol, etc.
    [7.8, 0.88, 0.00, 2.6, 0.098],
    [7.8, 0.76, 0.04, 2.3, 0.092],
    [11.2, 0.28, 0.56, 1.9, 0.075],
    [7.4, 0.70, 0.00, 1.9, 0.076],
    [7.9, 0.60, 0.06, 1.6, 0.069],
]

y_wine = ['5', '5', '5', '6', '5', '5']  # Quality ratings

# Define column names
columns = ['acidity', 'sugar', 'pH', 'alcohol', 'density', 'quality']

# Create CSV file
csv_filename = 'wine_quality_data.csv'

with open(csv_filename, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    
    # Write header
    writer.writerow(columns)
    
    # Write data rows
    for i, features in enumerate(X_wine):
        row = features + [y_wine[i]]
        writer.writerow(row)

print(f"CSV file '{csv_filename}' has been created successfully!")
print(f"Total rows: {len(X_wine)}")
print(f"Columns: {', '.join(columns)}")
