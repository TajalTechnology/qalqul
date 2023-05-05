const { Client } = require("@elastic/elasticsearch");
export const esClient = new Client({ node: "http://localhost:9200" });
