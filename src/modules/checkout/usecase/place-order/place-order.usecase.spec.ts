import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product-entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000,1,1);

describe("PlaceOrderUseCase unit tests", () => {
  describe("execute method", () => {
    
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it("it should throw an error when client not found", async ()=> {
      
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn()
      }
      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase()

      placeOrderUseCase["_clientFacade"] = mockClientFacade;
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: []
      }
      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    
    
  });
  describe("validateProducts methos", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when products not selected", async () =>{


      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: []
      }
     
     
      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow("No products selected");
    });

    it("should throw an error when product is out of stock", async () => {
      
      const mockProductFacade = {
        checkStock: jest.fn(({productId} : {productId: string}) => 
        Promise.resolve({
          productId,
          stock: productId === "1" ? 0 : 1,
        }))
      }

      //@ts-expect-error
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{productId: "1"}]
      }

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );


      input = {
        clientId: "0",
        products: [{productId: "0"},{productId: "1"}]
      }

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{productId: "0"},{productId: "1"}, {productId: "2"}]
      }

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);

    });
    

  })
  describe("getProducts method", () => {
    

    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();
    
    it("should throw an error when product not found", async () => {

      const mockCatalogueFacade = {
        find: jest.fn().mockResolvedValue(null),
      }

      //@ts-expect-error
      placeOrderUseCase["_catalogueFacade"] = mockCatalogueFacade;
      
      
      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product 0 not found")
      );
    });

    it("should return a product", async () => {

      const mockCatalogueFacade = {
        find: jest.fn().mockResolvedValue({
          id:"1",
          name: "Product 1",
          description: "Description Product 1",
          salesPrice: 10.0
        })
      };

    //@ts-expect-error
    placeOrderUseCase["_catalogueFacade"] = mockCatalogueFacade;
    
    const product = await placeOrderUseCase["getProduct"]("1");
    expect(product.id.id).toEqual("1");
    expect(product.name).toEqual("Product 1");
    expect(product.description).toEqual("Description Product 1");
    expect(product.salesPrice).toBe(10.0);

    expect(mockCatalogueFacade.find).toHaveBeenCalledTimes(1);
    });
  })
  describe("place an order", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    const clientProps = {
      id: "1c",
      name: "Client 1",
      document: "0000",
      email: "client1@email.com",
      street: "main street",
      number: "10",
      complement: "",
      city:"city",
      zipCode:"55000055",
      state:"NY",
    };

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clientProps),
      add: jest.fn()
    };

    const mockPaymentFacade = {
      process: jest.fn(),
      find: jest.fn()
    };

    const mockCheckOutRepo ={
      addOrder: jest.fn(),
      findOrder: jest.fn()
    };
    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({id: "1i"}),
      find: jest.fn()
    };

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade,
      null,
      null,
      mockCheckOutRepo,
      mockInvoiceFacade,
      mockPaymentFacade,
    );

    const products = {
      "1": new Product({
        id: new Id("1"),
        name: "Product 1",
        description: "Description Product 1",
        salesPrice: 10.0
      }), 
      "2": new Product({
        id: new Id("2"),
        name: "Product 2",
        description: "Description Product 2",
        salesPrice: 20.0
      }),
    };

    //@ts-expect-error
    const mockValidateProducts = jest.spyOn(placeOrderUseCase, "validateProducts").mockResolvedValue(null);

    //@ts-expect-error
    const mockGetProduct = jest.spyOn(placeOrderUseCase, "getProduct").mockImplementation((productId: keyof typeof products) => {
        return products[productId]
    });

    it("shouldn't be approved", async () => {

      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100.0,
        status: "error",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const input: PlaceOrderInputDto = {
      clientId: "1c",
      products: [{productId: "1"}, {productId: "2"}]
      }

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(30.0);
      expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckOutRepo.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it("should be approved", async () => {

      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100.0,
        status: "approved",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{productId: "1"}, {productId: "2"}]
        }
  
      const output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBe("1i");
      expect(output.total).toBe(30.0);
      expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckOutRepo.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: clientProps.name,
        document: clientProps.document,
        street: clientProps.street,
        number: clientProps.number,
        complement: clientProps.complement,
        zipCode: clientProps.zipCode,
        city: clientProps.city,
        state: clientProps.state,
        items: [
          {
            id: products["1"].id.id,
            name: products["1"].name,
            price: products["1"].salesPrice
          },
          {
            id: products["2"].id.id,
            name: products["2"].name,
            price: products["2"].salesPrice
          }
        ]
      });
  
    });


  });
});