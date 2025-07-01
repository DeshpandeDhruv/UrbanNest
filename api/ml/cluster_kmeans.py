# cluster_kmeans.py
import json, pandas as pd, requests
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

res = requests.get("http://localhost:5000/api/listing/get?limit=1000")
data = res.json()
df = pd.DataFrame(data)

df['furnished'] = df['furnished'].astype(int)
df['offer'] = df['offer'].astype(int)
type_map = {t: i for i, t in enumerate(df['type'].unique())}
df['type_encoded'] = df['type'].map(type_map)

X = StandardScaler().fit_transform(df[['regularPrice','bedrooms','furnished','offer','type_encoded']])
kmeans = KMeans(n_clusters=5, random_state=42).fit(X)
df['cluster'] = kmeans.labels_

cluster_map = {row['_id']: int(row['cluster']) for _, row in df.iterrows()}
with open('api/data/clusterMap.json', 'w') as f:
    json.dump(cluster_map, f)
print("clusterMap.json generated 🗺️")
