import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLUnionType,
  GraphQLList
} from 'graphql';

const DATA = [
  { username : 'catherine' },
  { director : 'catherine hardwicke' },
  { author : 'catherine cookson' }
];

const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    username : {
      type : GraphQLString
    }
  }
});

const MovieType = new GraphQLObjectType({
  name : 'Movie',
  fields : {
    director : {
      type : GraphQLString
    }
  }
});

const BookType = new GraphQLObjectType({
  name : 'Book',
  fields : {
    author : {
      type : GraphQLString
    }
  }
});


const SearchableType = new GraphQLUnionType({
  name: 'SearchableType',
  types: [ UserType, MovieType, BookType ],
  resolveType(data) {
    if (data.username) {
      return UserType;
    }
    if (data.director) {
      return MovieType;
    }
    if (data.author) {
      return BookType;
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      search: {
        type: new GraphQLList(SearchableType),
        args:  {
          text: {
            type : new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          const text = args.text;
          return DATA.filter((d) => {
            const searchableProperty = d.username || d.director || d.author;
            return searchableProperty.indexOf(text) !== -1;
          });
        }
      }
    }
  })
});

const query = `
  {
    search(text: "cat") {
      ... on User {
        username
      }
      ... on Movie {
        director
      }
      ... on Book {
        author
      }
    }
  }
`;

graphql(schema, query).then(result => {
  console.log(JSON.stringify(result, null, 2));
});
