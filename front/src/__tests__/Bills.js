/**
 * @jest-environment jsdom
 */

 import {screen, waitFor} from "@testing-library/dom"
 import userEvent from '@testing-library/user-event'
 import '@testing-library/jest-dom/extend-expect'
 
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store"
 import router from "../app/Router.js";
 import Bills from "../containers/Bills.js";
 
 
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       //to-do write expect expression
       expect(windowIcon).toHaveAttribute("class", "active-icon")
 
     })
     test("Then bills should be ordered from earliest to latest", async () => {
       // document.body.innerHTML = BillsUI({data: bills})
       // document.body.innerHTML = bills.date
       // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
       const onNavigate = (pathname) => {
         return null
       }
       const billsContainer = new Bills({ 
         document,
         onNavigate,
         store: mockStore,
         localStorage: null  
       })
       const bill = await billsContainer.getBills()
       const dates = bill.map(bill => bill.date)
 
 
       const antiChrono = (a, b) => ((a < b) ? 1 : -1)
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
   })
})
 
describe('Given I am connected as Employe and I am on Bill page and I clicked on a bill', () => {
   describe('When I click on the icon eye', () => {
     test('Then, modal sould open',async () => {
         Object.defineProperty(window, 'localStorage', { value: localStorageMock })
         window.localStorage.setItem('user', JSON.stringify({
           type: 'Employee'
         }))
         document.body.innerHTML = BillsUI({data: bills})
         
         const onNavigate = (pathname) => {
           document.body.innerHTML = ROUTES(pathname)
         }
       
       const billsContainer = new Bills({ 
         document,
         onNavigate,
         store: null,
         localStorage: window.localStorage
       })
 
       const eyes = screen.getAllByTestId('icon-eye')
       eyes.map(icon => {
         const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye(icon))
         icon.addEventListener('click', handleClickIconEye)
         userEvent.click(icon)
         expect(handleClickIconEye).toHaveBeenCalled();
       })
       
       const modale = screen.getByTestId("modaleFile1")
       expect(modale).toBeTruthy()
     })
   })
})
 
 