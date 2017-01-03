# cqrs-example

CQRS with Denormalizer example repo for the Node.js at Scale blog series

## Requirements

- Node.js
- RabbitMQ: `brew install rabbitmq`

## Usage

```
npm start
```

In this example you can see how an imaginary user service emits change events.
A denormalizer listens for these change events and stores a subset of the user *(name only)* in a Reporting Database for further client queries.

Because of eventually consistency the Reporting Database is may out of sync.

### Inputs

```
Create user:  { name: 'John Doe', state: 'default' }
Update user's state:  { state: 'churn' }
Rename user:  { name: 'John Smith' }
```

### Output

```
Running...
User in user service database { id: 'aaa', name: 'John Smith', state: 'churn' }
User in Reporting Database { name: 'John Smith'
```
