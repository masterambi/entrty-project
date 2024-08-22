import { ChildControllers, Controller } from "@overnightjs/core";
import CartsController from "./carts/controller";
import ProductsController from "./products/controller";
import AuthController from "./auth/controller";

@Controller("api/v1")
@ChildControllers([
  new CartsController(), 
  new ProductsController(), 
  new AuthController()
])
class V1Controller {}

export default V1Controller;
