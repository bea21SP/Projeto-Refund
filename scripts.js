// Seleciona os elementos do formulário.

const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header  p span")



amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    //captura o valor do input, tirando os caracteres não numéricos

    // transformar valor em centavos
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
    // devolvendo só números
}

function formatCurrencyBRL(value) {
    // formata o valor no BRL (Real Brasileiro)
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
    // retorna o valor atualizado
    return value
}

//captura o evento do submite para obter os valores
form.onsubmit = (event) => {
    //previne o comportamento de recarregar a página
    event.preventDefault()

    // cria um objeto com os detalhes na nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    //chama a função que irá adicionar o item na lista.
    expenseAdd(newExpense)
}
// Adiciona um novo item na Lista.
function expenseAdd(newExpense){
    try {
        //throw new Error("Erro de teste") (teste)
        // cria elemento de li para adicionar o item(li) na lista.(ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o ícone da categoria.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //cria o nome da despensa.
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa.
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona name e category na div das informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")
        }`

        // Cria o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // Adiciona as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adicional item na lista
        expenseList.append(expenseItem)

    // Limpa o formuçário para adicionar um novo item
        clearForm()

        // Atualiza os totais
        updateTotals()
    } catch(error){
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

// Atualiza o valor total das despesas.
function updateTotals(){
    try {
        // Recupera todos os itens da lista
        const items = expenseList.children
        // Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // Variável para incrementar o total.
        let total = 0

        // Percorre cada item(li) da lista(ul)
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remover caracteres não numericos e substitui a vígula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            value = parseFloat(value)

            //Verifica e é número válido.
            if(isNaN(value)){
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }
            // Incrementar o valor total
            total += Number(value)
        }

        // Criar ums span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = ""

        // Adiciona o símbolo da moeda e o valor formatado
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }

}

// Evento que captura os itens da lista

expenseList.addEventListener("click", function (event){
    // verifica se o elemento clicado é o ícone de remover.
    if(event.target.classList.contains("remove-icon")){
        // Obtem a li pai do item clicado
        const item = event.target.closest(".expense")

        //Remove itens
        item.remove()
    }

    updateTotals()
})

function clearForm(){
    // Limpa os campos do formulário
    amount.value = ""
    expense.value = ""
    category.value = ""

    // Coloca o foco no input de amount para facilitar a adição de uma nova despesa.
    expense.focus()
}




