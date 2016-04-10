import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLUnionType,
  GraphQLList,
  GraphQLInterfaceType
} from 'graphql';

const DATA = [
  { username : 'catherine' },
  { director : 'catherine hardwicke' },
  { author : 'catherine cookson' }
];

const resolveType = (data) => {
  if (data.username) {
    return UserType;
  }
  if (data.director) {
    return MovieType;
  }
  if (data.author) {
    return BookType;
  }
};

const SearchableType = new GraphQLInterfaceType({
  name: 'Searchable',
  fields: {
    searchPreviewText: { type: GraphQLString }
  },
  resolveType: resolveType
});

const UserType = new GraphQLObjectType({
  name : 'User',
  interfaces: [SearchableType],
  fields : {
    username : {
      type : GraphQLString
    },
    searchPreviewText : {
      type : GraphQLString,
      resolve(data) {
        return `(user) ${data.username}`;
      }
    }
  }
});

const MovieType = new GraphQLObjectType({
  name : 'Movie',
  interfaces: [SearchableType],
  fields : {
    director : {
      type : GraphQLString
    },
    searchPreviewText : {
      type : GraphQLString,
      resolve(data) {
        return `(director) ${data.director}`;
      }
    }
  }
});

const BookType = new GraphQLObjectType({
  name : 'Book',
  interfaces: [SearchableType],
  fields : {
    author : {
      type : GraphQLString
    },
    searchPreviewText : {
      type : GraphQLString,
      resolve(data) {
        return `(author) ${data.author}`;
      }
    }
  }
});

const schema = new GraphQLSchema({
  types: [MovieType, BookType, UserType, SearchableType],
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
      searchPreviewText
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
