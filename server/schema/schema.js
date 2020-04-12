const graphql = require("graphql");
const _ = require("lodash");
const Author = require("../models/author");
const Book = require("../models/book");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList
} = graphql;

// dummy data
// var dummyBooks = [
//   { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
//   { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
//   { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "4" },
//   { name: "Special Agent", genre: "Sci-Fi", id: "4", authorId: "4" }
// ];
// var AuthorsData = [
//   { name: "Patrick Rothfuss", age: 44, id: "1" },
//   { name: "Brandon Sanderson", age: 42, id: "2" },
//   { name: "Terry Pratchett", age: 66, id: "3" },
//   { name: "Jamaes Bond", age: 44, id: "4" }
// ];

// BookType is new objectType of the graph
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => {
    return {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      genre: { type: GraphQLString },
      author: {
        type: AuthorType,
        resolve(parent, args) {
          //return _.find(AuthorsData, { id: parent.authorId });
          return Author.findById(parent.authorId);
        }
      }
    };
  }
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    id: { type: GraphQLID },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return _.filter(dummyBooks, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } }, // changed from GraphQLString to GraphQLID to avoid data-type constraint.
      resolve(parent, args) {
        console.log("finding book with id >> " + args.id);
        // code to get data from db / other source
        //return _.find(dummyBooks, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(AuthorsData, { id: args.id });
        return Author.findById(args.id);
      }
    },
    bookz: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return dummyBooks;
        return Book.find({}); // returns all objects if find is provided with empty object.
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

/* 
- A schema is a representation of functionality such as query and mutation available to the client.
- 

*/
