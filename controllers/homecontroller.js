var courses = [
    {
        title : "Rasberry Cake",
        cost: 50
    },
    {
        title : "Artichoke",
        cost: 50
    },
    {
        title : "Burger",
        cost: 100
    },
];

module.exports = {
    index:(req,res) =>{
        res.render("index");
    }
}
