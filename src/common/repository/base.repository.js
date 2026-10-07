// methods add 

export const create = async ({
    model ,
     data=[] ,
      options={}
    } = {})=>{
return await model.create(data , options) || []
}


export const createOne = async ({
    model ,
     data ,
      options={}
    } = {})=>{
const [doc] = await model.create([data] , options) || []
return doc
}

export const insertMany = async ({
  model,
  data,
  options = {}

}) => {
  return (await model.insertMany(data))
}

//methods find

export const find = async ({
  filter,
  options,
  model
} = {}) => {
  const doc = model.find(filter || {})
  if (options?.select) {
    doc.select(options.select);
  }
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.skip) {
    doc.skip(options.skip);
  }

  if (options?.limit) {
    doc.limit(options.limit);
  }

  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}

export const findById = async ({
  id,
  options,
  model
}) => {
  const doc = model.findById(id)
  if (options?.select) {
    doc.select(options.select);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}

export const findOne = async ({
  model,
  filter ={},
  options ={}
  
} = {}) => {
  const doc = model.findOne(filter)
    if (options?.select) {
    doc.select(options.select);
  }
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}


export const paginate = async ({
  filter = {},
  options = {},
  select,
  page = "all",
  size = 5,
  model

} = {}) => {
  let docsCount = undefined;
  let pages = undefined;
  if (page !== "all") {
    page = Math.floor(page < 1 ? 1 : page);
    options.limit = Math.floor(size < 1 || !size ? 5 : size);
    options.skip = (page - 1) * options.limit;

    docsCount = await model.countDocuments(filter);
    pages = Math.ceil(docsCount / options.limit);
  }
  const result = await find({ model, filter, select, options });
  return {
    docsCount,
    limit: options.limit,
    pages,
    currentPage: page !== "all" ? page : undefined,
    result,
  };
}

//methods update


export const updateOne = async ({
  model,
  filter,
  update,
  options
  

} = {}) => {

  return await model.updateOne(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    options
  );
}

export const findOneAndUpdate = async ({
  filter,
  update,
  options,
  model

} = {}) => {

  return await model.findOneAndUpdate(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    {
      new: true,
      runValidators: true,

      ...options,
    }
  );
}

export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
  model

}) => {
  return await model.findByIdAndUpdate(
    id,
    { ...update, $inc: { __v: 1 } },
    options
  );
}


//methods delete

export const deleteOne = async ({
  filter,
  model

}) => {
  return await model.deleteOne(filter || {});
}

export const deleteMany = async ({
  filter,
  model

}) => {
  return await model.deleteMany(filter || {});
}

export const findOneAndDelete = async ({
  filter,
  model

} = {}) => {
  return await model.findOneAndDelete(
    filter || {},
  );
}