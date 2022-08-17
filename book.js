//Api tokens and private key
const token = "";
const API_KEY = "";
const private_key = "";

//Pin on ipfs using nft.storage
import { NFTStorage, File } from "https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js";
const endpoint = 'https://api.nft.storage'
const booksAddress = "0xF8906eeD015474109B2a1f1d0F302c908f5fE392";
const booksAbi = [
    // "function getBooks() view returns (string[])",
    // "functions addBook(string memory uri, string memory book)"
    {
        "inputs": [],
        "name": "getBooks",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "book",
            "type": "string"
          }
        ],
        "name": "addBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

//showPDF('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
var file;

// Links would later be store in a smart contract
var books = [];
const getBooks = async (amount) => {
    // books = [
    //     'bafybeib7ig7hsiunsav33ztxe2tzauv4hwbgk27chajz42pq3ccqfsrsuu/Eloquent_JavaScript.pdf',
    //     'bafybeif2xeyg7f4kv5bqmq4r4ees6mhq5c5puidjkg6hnak34zrwhys4t4/Do the Work by Steven Pressfield ( PDFDrive ).pdf'
    // ];
    if (localStorage.getItem("books")) {
     books = JSON.parse(localStorage.getItem("books"))
     if (amount) {
        books = books.slice(0, 3);
     }
    }
    const container = document.querySelector(".books_container"); 
    displayBooks(container);
    try {
        const provider = new ethers.providers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`);
        var signer = new ethers.Wallet(private_key, provider);
        // console.log(signer)
        const booksContract = new ethers.Contract(booksAddress, booksAbi, signer);
        let new_books = await booksContract.getBooks();
        console.log(new_books);
        // Reload if there is a new book
        if (new_books) {
            localStorage.setItem("books", JSON.stringify(new_books));
            if (books.length != new_books.length) {
                location.reload();
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

const displayBooks = (container, amount=0) => {
    if (!amount) {
        books.map((book) => {appendBook(container, book)})
    }
    else {
        console.log(books)
        books.slice(0, amount).map((uri) => {appendBook(container, cid)})
    }
}

const appendBook = (container, uri) => {
    //Create the div and canvas, Add book class to div, Call showPDF
    
    //Use ipfs.io gateway to get books
    const book = "https://ipfs.io/ipfs/" + uri.slice(6);
    // const book = uri;
    const book_div = document.createElement('div');
    const a = document.createElement("a");
    a.href = book;
    const book_canvas = document.createElement('canvas');
    book_div.classList.add("book")
    // console.log(container)
    container.appendChild(a);
    a.append(book_div);
    book_div.appendChild(book_canvas);
    // console.log(book)
    showPDF(book, book_canvas);

} 

const handleChange = async(e) => {
    file = document.getElementById("file")?.files[0];
}

document.getElementById("file")?.addEventListener("change", () => handleChange());

const addFile = async() => {
    const status = document.getElementById("status");
    if (file && file.name.slice(-3) == "pdf") {
        status.innerText = "Uploading book to IPFS...";
        let saved_books = [];
        if (localStorage.getItem("books")){
            saved_books = JSON.parse(localStorage.getItem("books"));
        }
        // console.log(saved_books);
        const storage = new NFTStorage({ endpoint, token })
        const book_metadata = await storage.store({
            name: file.name,
            description: file.name,
            image: file
        })

        const url = book_metadata.url;
        const book_url = book_metadata.data.image.href;

        try {
            status.innerText = "Minting book as NFT...";
            const provider = new ethers.providers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com/v1/022fd3cf836ccc65239550879cee7094077e1578`);
            var signer = new ethers.Wallet(private_key, provider);
            // console.log(signer)
            const booksContract = new ethers.Contract(booksAddress, booksAbi, signer);
            console.log("book: ", url, book_metadata.data.image.href);
            console.log("book contract: ", booksContract)
            const tx = await booksContract.addBook(url, book_url);
            console.log("Transaction sent, waiting for confirmation");
            await tx.wait();
            console.log("Transaction confirmed")
        } catch (error) {
            console.log(error)
            // alert("An error occured while adding books!");
            status.innerText = "";
            return;
        }
        
        console.log(saved_books);
        saved_books = [book_url, ...saved_books];
        console.log(saved_books);
        localStorage.setItem("books", JSON.stringify(saved_books));
        alert("Book successfully added to the library!");
        // location.reload();
    }
    else {
        alert("Please choose a pdf file first");
    }
}

document.getElementById("upload_book")?.addEventListener("click", () => addFile());

// initialize and load the PDF
async function showPDF(pdf_url, CANVAS) {
    let pdfDoc;
    try {
        pdfDoc = await pdfjsLib.getDocument({ url: pdf_url });
    }
    catch(error) {
        console.log(error.message);
    }
    showPage(pdfDoc, 1, CANVAS);
    return pdfDoc.numPages;
}

// load and render specific page of the PDF
async function showPage(pdfDoc, page_no, CANVAS) {
    let page;
    try {
        page = await pdfDoc.getPage(page_no);
    }
    catch(error) {
        console.log(error.message);
    }
    // original width of the pdf page at scale 1
    let pdf_original_width = page.getViewport(1).width;
    // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
    let scale_required = CANVAS.width / pdf_original_width;
    // get viewport to render the page at required scale
    let viewport = page.getViewport(scale_required);
    // set canvas height same as viewport height
    CANVAS.height = viewport.height;
    // page is rendered on <canvas> element
    let render_context = {
        canvasContext: CANVAS.getContext('2d'),
        viewport: viewport
    };
    // render the page contents in the canvas
    try {
        await page.render(render_context);
    }
    catch(error) {
        console.log(error.message);   
    }
}

if (document.querySelector('.bookspage')) {
    getBooks();
}

if (document.querySelector(".homepage")) {
    getBooks();
}