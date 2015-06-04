module.exports.formatDate = function (value)
{
   return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getYear();
};