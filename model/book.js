module.exports = {
  name: 'book',
  fields: [
    {
      name: 'id',
      type: 'String',
      length: '20',
      not_null: true,
      primary_key: true
    },
    {
      name: 'tid',
      type: 'String',
      length: 64,
      not_null: true,
      unique: true
    },
    {
      name: 'ownerId',
      type: 'String',
      length: 50,
      not_null: true
    },
    {
      name: 'timestamp',
      type: 'Number',
      not_null: true
    },
    {
      name: 'title',
      type: 'String',
      length: 256,
      not_null: true
    },
	{
      name: 'text',
      type: 'String',
      length: 4096,
      not_null: true
    },
    {
      name: 'unitPrice',
      type: 'Number',
      not_null: true
    },
	{
      name: 'sellPrice',
      type: 'Number',
      not_null: true
    },
    {
      name: 'capacity',
      type: 'Number',
      not_null: true
    },
	{
      name: 'sellState',
      type: 'Number',
      not_null: true
    },
	{
      name: 'gainWay',
      type: 'Number',
      not_null: true
    },
    {
      name: 'sellNumber',
      type: 'Number',
      not_null: true,
      default: 0
    }
  ]
}