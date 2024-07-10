from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Replace with the path to your CSV file
data_path = "your_data.csv"

# Read data into a pandas DataFrame (assuming it's already done)
try:
  data = pd.read_csv(data_path)
except FileNotFoundError:
  print("Error: Data file not found. Please check the path.")
  exit(1)

def search_data_from_df(search_term, search_by, data):
  """
  Searches the data by a given term and criteria.

  Args:
      search_term (str): The term to search for.
      search_by (str): The column name to search within.
      data (pandas.DataFrame): The DataFrame containing the data.

  Returns:
      pandas.DataFrame: A DataFrame containing the search results.
  """
  search_term = search_term.lower()  # Case-insensitive search
  results = data[data[search_by].str.lower().contains(search_term)]
  return results

def add_new_entry_to_df(new_entry, data):
  """
  Adds a new entry (dictionary) to the data.

  Args:
      new_entry (dict): A dictionary containing the new entry data.
      data (pandas.DataFrame): The DataFrame containing the data.

  Returns:
      None
  """
  # Append the new entry dictionary to the data DataFrame
  data = data.append(new_entry, ignore_index=True)  # Avoid duplicate indexing

def update_entry_in_df(material_name, updated_data, data):
  """
  Updates an existing entry based on material name.

  Args:
      material_name (str): The name of the material to update.
      updated_data (dict): A dictionary containing the updated values.
      data (pandas.DataFrame): The DataFrame containing the data.

  Returns:
      None
  """
  # Find the index of the entry to update
  try:
    index = data[data['material_name'] == material_name].index.tolist()[0]
  except IndexError:
    return {"error": "Material not found for update!"}

  # Update the corresponding entries in the DataFrame
  data.loc[index] = updated_data

@app.route("/search", methods=["POST"])
def search_data():
  try:
    search_term = request.json.get("search_term")
    search_by = request.json.get("search_by")

    if not search_term or not search_by:
      return jsonify({"error": "Missing search term or search criteria!"}), 400

    results = search_data_from_df(search_term, search_by, data)
    return jsonify(results.to_dict(orient="records"))
  except Exception as e:
    print(f"Error during search: {e}")
    return jsonify({"error": "Internal server error!"}), 500

@app.route("/add", methods=["POST"])
def add_new_entry():
  try:
    new_entry = request.json
    if not new_entry:
      return jsonify({"error": "Missing data for new entry!"}), 400

    add_new_entry_to_df(new_entry, data)
    # Save the updated data back to the CSV file (optional)
    data.to_csv(data_path, index=False)
    return jsonify({"message": "New entry added successfully!"})
  except Exception as e:
    print(f"Error adding new entry: {e}")
    return jsonify({"error": "Internal server error!"}), 500

@app.route("/update/<material_name>", methods=["PUT"])
def update_entry(material_name):
  try:
    updated_data = request.json
    if not updated_data:
      return jsonify({"error": "Missing data for update!"}), 400

    response = update_entry_in_df(material_name, updated_data, data)
    if "error" in response:
      return jsonify(response), 404  # Not found

    # Save the updated data back to the CSV file (optional)
    data.to_csv(data_path, index.html)
    return jsonify({"message": "Entry updated successfully!"})
  except Exception as e:
    print(f"Error updating entry: {e}")
    return jsonify({"error": "Internal server error!"}), 500

if __name__ == "__main__":
  app.run(debug=True)  # Set debug=False for production

