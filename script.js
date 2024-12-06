document.getElementById("btn").addEventListener("click", async () => {
    console.log(await window.db.test());
}) 
