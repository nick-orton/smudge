function rand(top) {
  return Math.floor(Math.random() * top);
}

exports.rand = rand;

exports.choose = function(array) {
  return array[rand(array.length)];
}

exports.prob = function(chance) {
  return rand(10000) < chance;
}
