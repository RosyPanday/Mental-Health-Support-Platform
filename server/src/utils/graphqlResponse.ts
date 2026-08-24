import type { GraphqlResponseInterface, GraphqlResponseParamsInterface } from "#src/interfaces/graphqlResponseInterface.js";

export class GraphqlResponse {
    constructor() { }
    
    static send<T>(params: GraphqlResponseParamsInterface<T>): GraphqlResponseInterface<T> {
        return params;
    }
}