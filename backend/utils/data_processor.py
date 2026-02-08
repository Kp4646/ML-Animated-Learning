import pandas as pd
import numpy as np
import io
import json
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

class DataProcessor:
    def __init__(self):
        self.df = None
        self.X = None
        self.y = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.target_encoder = None
        self.feature_columns = []
        self.target_column = None
        self.is_classification = True

    def parse_file(self, file, filename):
        """
        Parses the uploaded file into a Pandas DataFrame.
        Supports CSV, JSON, and TXT (assumed CSV).
        """
        try:
            if filename.endswith('.csv') or filename.endswith('.txt'):
                # Try reading with default comma separator
                try:
                    self.df = pd.read_csv(file)
                except:
                    # Fallback to tab separator if comma fails
                    file.seek(0)
                    self.df = pd.read_csv(file, sep='\t')
            elif filename.endswith('.json'):
                self.df = pd.read_json(file)
            else:
                raise ValueError("Unsupported file format. Please upload .csv, .txt, or .json")
            
            return {
                "columns": self.df.columns.tolist(),
                "preview": self.df.head().to_dict(orient='records'),
                "total_rows": len(self.df)
            }
        except Exception as e:
            raise ValueError(f"Error parsing file: {str(e)}")

    def preprocess(self, feature_cols, target_col, is_classification=True):
        """
        Preprocesses the data:
        1. Selects feature and target columns.
        2. Imputes missing values.
        3. Encodes categorical variables.
        4. Scales numerical features.
        """
        if self.df is None:
            raise ValueError("No data loaded. Please upload a file first.")
        
        self.feature_columns = feature_cols
        self.target_column = target_col
        self.is_classification = is_classification

        # Separate Features and Target
        X_df = self.df[feature_cols].copy()
        y_series = self.df[target_col].copy()

        # --- 1. Handle Missing Values ---
        # Numeric columns: Fill with Mean
        numeric_cols = X_df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            num_imputer = SimpleImputer(strategy='mean')
            X_df[numeric_cols] = num_imputer.fit_transform(X_df[numeric_cols])

        # Categorical columns: Fill with Mode (Most Frequent)
        categorical_cols = X_df.select_dtypes(exclude=[np.number]).columns
        if len(categorical_cols) > 0:
            cat_imputer = SimpleImputer(strategy='most_frequent')
            X_df[categorical_cols] = cat_imputer.fit_transform(X_df[categorical_cols])

        # --- 2. Encode Categorical Features ---
        self.label_encoders = {}
        for col in categorical_cols:
            le = LabelEncoder()
            X_df[col] = le.fit_transform(X_df[col].astype(str))
            self.label_encoders[col] = le

        # --- 3. Encode Target Variable ---
        if is_classification:
            # Check if target is not numeric (object, string, categorical)
            is_numeric = pd.api.types.is_numeric_dtype(y_series)
            if not is_numeric:
                 self.target_encoder = LabelEncoder()
                 y_encoded = self.target_encoder.fit_transform(y_series.astype(str))
            else:
                self.target_encoder = None
                y_encoded = y_series.values
        else:
            # Regression: Ensure target is numeric
            y_encoded = pd.to_numeric(y_series, errors='coerce').fillna(0).values
            self.target_encoder = None

        # --- 4. Scale Numeric Features ---
        # We scale ALL features now since categorical ones are label encoded
        self.X = self.scaler.fit_transform(X_df)
        self.y = y_encoded

        return self.X, self.y

    def get_metadata(self):
        """
        Returns metadata about the preprocessing (encoders, mappings, etc.)
        Useful for frontend to display what happened.
        """
        mappings = {}
        for col, le in self.label_encoders.items():
            mappings[col] = dict(zip(le.classes_, le.transform(le.classes_).tolist()))
        
        target_mapping = {}
        if self.target_encoder:
            target_mapping = dict(zip(self.target_encoder.classes_, self.target_encoder.transform(self.target_encoder.classes_).tolist()))

        return {
            "feature_mappings": mappings,
            "target_mapping": target_mapping,
            "feature_columns": self.feature_columns,
            "target_column": self.target_column
        }
