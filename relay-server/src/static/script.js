var source = $("#wait_user,#play_user").html();
var template = Handlebars.compile(source);
var data = {
items: [
{
name: "STRAWBERRY",
number: "1",
score: 100,
card: "static/image/strawberry_1.svg"
},
{
name: "LEMON",
number: "2",
score: 200,
card: "static/image/strawberry_2.svg"
},
{
name: "PEAR",
number: "3",
score: 300,
card: "static/image/strawberry_3.svg"
},
{
name: "PINEAPPLE",
number: "4",
score: 400,
card: "static/image/strawberry_4.svg"
}
]
};
var itemList = template(data);
$('.wait_user,.play_user').append(itemList);

