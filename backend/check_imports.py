
import sys
import os

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

print("Checking imports...")
try:
    print("Importing flask...")
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    
    print("Importing sklearn...")
    from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
    
    print("Importing pandas...")
    import pandas as pd
    
    print("Importing models...")
    from models.Reg import run_polynomial_regression
    from models.knn import predict_single_point, generate_decision_boundary
    from models.kmeans import run_kmeans, generate_clustering_data
    from models.PCA import run_pca, generate_pca_data
    from models.DTrees import run_decision_tree_classification
    from models.SVM import run_svm
    from models.ANN import run_ann
    
    print("All imports successful!")
except Exception as e:
    print(f"Import Error: {e}")
    import traceback
    traceback.print_exc()
