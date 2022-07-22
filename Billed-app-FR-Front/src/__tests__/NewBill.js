/**
 * @jest-environment jsdom
 */

 import {fireEvent, getByTestId, screen, waitFor} from "@testing-library/dom"
 import '@testing-library/jest-dom/extend-expect'
 import userEvent from "@testing-library/user-event";
 
 import NewBillUI from "../views/NewBillUI.js"
 import BillsUI from "../views/BillsUI.js";
 import NewBill from "../containers/NewBill.js"
 import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store"
 import { formatDate } from "../app/format.js"
 import router from "../app/Router.js";
 
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
       //to-do write assertion
       // const html = NewBillUI()
       //document.body.innerHTML = html
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement('div')
       root.setAttribute('id', "root");
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.NewBill)
       await waitFor(() => screen.getByTestId("icon-mail"))
       const mailIcon = screen.getByTestId("icon-mail")
       expect(mailIcon).toHaveAttribute("class", "active-icon")
     })
     test("I watch all input", () => {
       const html = NewBillUI()
       document.body.innerHTML = html
       expect(screen.getByText("Type de dépense")).toBeTruthy();
       expect(screen.getByText("Nom de la dépense")).toBeTruthy();
       expect(screen.getByText("Date")).toBeTruthy();
       expect(screen.getByText("Montant TTC")).toBeTruthy();
       expect(screen.getByText("TVA")).toBeTruthy();
       expect(screen.getByText("%")).toBeTruthy();
       expect(screen.getByText("Commentaire")).toBeTruthy();
       expect(screen.getByText("Justificatif")).toBeTruthy();
       expect(screen.getByText("Envoyer")).toBeTruthy();
     })
 
     describe('When, I submit Form NewBill', () => {
       test("Then, you click on button 'Envoyer' with all fields empty", async () => {
 
         const onNavigate = (pathname) => {
           document.body.innerHTML = ROUTES({ pathname })
         }
 
         Object.defineProperty(window, 'localStorage', { value: localStorageMock })
         window.localStorage.setItem('user', JSON.stringify({
           type: 'Employee'
         }))
 
         const newBills = new NewBill({
           document, onNavigate, store:null, localStorage: window.localStorage 
         })
 
         document.body.innerHTML = NewBillUI()
 
         const handleSubmit = jest.fn((e) => newBills.handleSubmit(e))
 
         const formNewBill = screen.getByTestId("form-new-bill")
         const envoyer = screen.getByText("Envoyer")
 
         envoyer.addEventListener('click', () => {
           formNewBill.addEventListener('submit', handleSubmit)
         })
         userEvent.click(envoyer)
         expect(handleSubmit).toHaveBeenCalled()
       })
     })
 
     describe('When I fill in a field correctly', () => {
       test("Then I fill expense type with correct value", () => {
         const html = NewBillUI()
         document.body.innerHTML = html
         const expenseType = screen.getByTestId("expense-type");
         fireEvent.change(expenseType, {target: { value: "Transports" }})
         expect(expenseType.value).toBe("Transports")
       })
 
       test("Then I fill it expense name with a correct value", () => {
         const expenseName = screen.getByTestId("expense-name");
         fireEvent.change(expenseName, {target: { value: "vol" }})
         expect(expenseName.value).toBe("vol")
       })
       
       test("Then I fill it datePicker with correct value", () => {
         const datePicker = screen.getByTestId("datepicker");
         fireEvent.change(datePicker, {target: { value: "2015-05-23"}})
         expect(datePicker.value).toBeTruthy()
       })
       
       test("Then I fill it amount with correct value", () => {
         const amount = screen.getByTestId("amount");
         fireEvent.change(amount, {target: { value: 350}})
         expect(amount.value).toBe("350")
       })
 
       test("Then I fill it vat with correct value", () => {
         const vat = screen.getByTestId("vat");
         fireEvent.change(vat, {target: { value: 70}})
         expect(vat.value).toBe("70")
       })
       
       test("Then I fill it pct with correct value", () => {
         const pct = screen.getByTestId("pct");
         fireEvent.change(pct, {target: { value: 20}})
         expect(pct.value).toBe("20")
       })
       
       test("Then I fill it commentary with correct value", () => {
         const commentary = screen.getByTestId("commentary");
         fireEvent.change(commentary, {target: { value: "Voici ma notre de frais"}})
         expect(commentary.value).toBe("Voici ma notre de frais")
       })
       test("Then I fill it file with correct value", () => {
         const inputFile = screen.getByTestId("file");
         const files = new File(['monImage'], "monImages.jpg", {type: 'image/jpeg'})
         userEvent.upload(inputFile, "monImages.jpg")
         expect(inputFile.files[0]).toBe(files.name)
       })
     });
     describe('When I fill in fields in the wrong format and click the "Submit" button', () => {
       test("Then it should render newBill's page", () => {
         document.body.innerHTML = NewBillUI()
 
         const expenseType = screen.getByTestId("expense-type");
         fireEvent.change(expenseType, {target: { value: "Transports" }})
         expect(expenseType.value).toBe("Transports")
 
         const expenseName = screen.getByTestId("expense-name");
         fireEvent.change(expenseName, {target: { value: "vol" }})
         expect(expenseName.value).toBe("vol")
       
         const datePicker = screen.getByTestId("datepicker");
         fireEvent.change(datePicker, {target: { value: ""}})
         expect(datePicker.value).toBe("")
         
         const amount = screen.getByTestId("amount");
         fireEvent.change(amount, {target: { value: 350}})
         expect(amount.value).toBe("350")
         
         const vat = screen.getByTestId("vat");
         fireEvent.change(vat, {target: { value: 70}})
         expect(vat.value).toBe("70")
         
         const pct = screen.getByTestId("pct");
         fireEvent.change(pct, {target: { value: 20}})
         expect(pct.value).toBe("20")
         
         const commentary = screen.getByTestId("commentary");
         fireEvent.change(commentary, {target: { value: "Ma note de frais"}})
         expect(commentary.value).toBe("Ma note de frais")
         
         const inputFile = screen.getByTestId("file");
         const files = new File(['monImage'], "preview-facture-free-201801-pdf-1.jpg", {type: 'image/jpeg'})
         userEvent.upload(inputFile, "preview-facture-free-201801-pdf-1.jpg")
         expect(inputFile.files[0]).toBe(files.name)
 
         const form = screen.getByTestId("form-new-bill")
         const handleSubmit = jest.fn((event) => event.preventDefault());
 
         form.addEventListener("submit", handleSubmit);
         fireEvent.submit(form);
         expect(screen.getByTestId("form-new-bill")).toBeTruthy();
       });
     })
     describe('Given, I am New Bill', () => {
       test('When, I submit Form', () => {
         document.body.innerHTML = NewBillUI()
 
         const inputData = {
           expenseType: "Transports",
           expenseName: "Vols",
           datePicker: "2015-11-12",
           amount: '245',
           vat: '70',
           pct: '20',
           commentary: "ma note de frais",
           fileName: "preview-facture-free-201801-pdf-1.jpg" ,
         }
 
 
         const inputExpenseType = screen.getByTestId("expense-type");
         fireEvent.change(inputExpenseType, {target: { value: inputData.expenseType }})
         expect(inputExpenseType.value).toBe(inputData.expenseType)
 
         const inputExpenseName = screen.getByTestId("expense-name");
         fireEvent.change(inputExpenseName, {target: { value: inputData.expenseName }})
         expect(inputExpenseName.value).toBe(inputData.expenseName)
       
         const inputDatePicker = screen.getByTestId("datepicker");
         fireEvent.change(inputDatePicker, {target: { value: inputData.datePicker}})
         expect(inputDatePicker.value).toBe(inputData.datePicker)
         
         const inputAmount = screen.getByTestId("amount");
         fireEvent.change(inputAmount, {target: { value: inputData.amount}})
         expect(inputAmount.value).toBe(inputData.amount)
         
         const inputVat = screen.getByTestId("vat");
         fireEvent.change(inputVat, {target: { value: inputData.vat}})
         expect(inputVat.value).toBe(inputData.vat)
         
         const inputPct = screen.getByTestId("pct");
         fireEvent.change(inputPct, {target: { value: inputData.pct}})
         expect(inputPct.value).toBe(inputData.pct)
         
         const inputCommentary = screen.getByTestId("commentary");
         fireEvent.change(inputCommentary, {target: { value: inputData.commentary}})
         expect(inputCommentary.value).toBe(inputData.commentary)
         
         const inputFile = screen.getByTestId("file");
 
         const file = new File(['preview-facture-free-201801-pdf-1'], inputData.fileName, {type: "image/jpeg"})
         
         const form = screen.getByTestId("form-new-bill")
 
         Object.defineProperty(window, 'localStorage', {
           value: {
             getItem: jest.fn(() => '{"email": "test@example.com"}'),
             setItem: jest.fn(() => null),
           },
           writable: true,
         });
 
         const onNavigate = (pathname) => {
           document.body.innerHTML = ROUTES({ pathname });
         }
 
         let PREVIOUS_LOCATION = ""
 
 
         const newBill = new NewBill({
           document,
           localStorage: window.localStorage,
           onNavigate,
           PREVIOUS_LOCATION,
           store: mockStore,
         })
 
         userEvent.upload(inputFile, file)
         
         expect(file.name).toBe(inputData.fileName)
 
         const handleSubmit = jest.fn((newBill.handleSubmit))
         newBill.updateBill = jest.fn().mockResolvedValue({})
         form.addEventListener("submit", handleSubmit);
         fireEvent.submit(form);
         expect(handleSubmit).toHaveBeenCalled()
       })
     });
   })
 })
 