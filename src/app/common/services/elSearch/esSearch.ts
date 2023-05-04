const { Client } = require("@elastic/elasticsearch");
export const esClient = new Client({ node: "http://localhost:9200" });

export async function searchArticles(
    query: any,
    indexParams: any,
    fields: any
) {
    try {
        const response = await esClient.search({
            index: "articles",
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: fields,
                    },
                },
            },
        });
        return response.body.hits.hits;
    } catch (error) {
        console.error(error);
        return [];
    }
}
