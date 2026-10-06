//what if i use arrow function when should i use arrow function
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            //pass the req.body to the schema
            const result = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query
            });
            req.body = result.body;
            req.params = result.params;
            // console.log("✅ Zod Validation Passed successfully!");
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default validate;
//i really don't have idea how this function works
//here we don't need res parameter then why we passing it
//this schema.parse (req.pody) how validate
//how this schema will connect to the schema i created in a another file
