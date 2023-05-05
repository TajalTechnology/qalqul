## How to work this project:

-   Clone this repositary.
-   Run `npm install` or `yarn install`.
-   Run `npm run dev` or `yarn run dev`.
-   Api documentation: Visit `http://localhost:4000/api-docs/`

    > Task deatils and api documentations in here.

-   Redis run `http://localhost:9200/`

    > When user login then redis data will be update. If there is no data in redis server the data will fetch from `ElasticSearch`.

## Database desing

> I denormalization `Article` table `like` and `dislike` column so that we can count like dislike easyly which is comes from `likes` table.

![QALQUL-engine-db drawio (1)](https://user-images.githubusercontent.com/42303062/236540540-a4fbae1e-7417-4b15-8aa1-41466440d3a5.png)
