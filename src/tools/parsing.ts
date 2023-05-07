function parseDataStructure(jsonString: string): DataStructure {
  return JSON.parse(jsonString) as DataStructure;
}
