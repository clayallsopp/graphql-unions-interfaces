import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      search: {
        type: GraphQLString,
        args:  {
          text: {
            type : new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          return args.text;
        }
      }
    }
  })
});

const query = `
  {
    search(text: "cat")
  }
`;

graphql(schema, query).then(result => {
  console.log(result);
});
