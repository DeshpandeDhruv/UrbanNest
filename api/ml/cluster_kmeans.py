import os
import json
import pandas as pd
import requests
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv

# Load backend env
load_dotenv()

BASE_URL = os.getenv("BASE_API_URL", "http://localhost:5000")

print("Fetching data from:", BASE_URL)

res = requests.get(f"{BASE_URL}/api/listing/get?limit=1000")
data = res.json()

df = pd.DataFrame(data)

df['furnished'] = df['furnished'].astype(int)
df['offer'] = df['offer'].astype(int)

type_map = {t: i for i, t in enumerate(df['type'].unique())}
df['type_encoded'] = df['type'].map(type_map)

X = StandardScaler().fit_transform(
    df[['regularPrice', 'bedrooms', 'furnished', 'offer', 'type_encoded']]
)

kmeans = KMeans(n_clusters=5, random_state=42).fit(X)
df['cluster'] = kmeans.labels_

cluster_map = {row['_id']: int(row['cluster']) for _, row in df.iterrows()}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_path = os.path.join(BASE_DIR, "data", "clusterMap.json")

with open(output_path, "w") as f:
    json.dump(cluster_map, f)

print("clusterMap.json generated successfully")