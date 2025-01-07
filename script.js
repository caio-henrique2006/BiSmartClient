document.getElementById("btn").addEventListener("click", async () => {
    const response = await window.db.test();
    console.log(response);
}) 
