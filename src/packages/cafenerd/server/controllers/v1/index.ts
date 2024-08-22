import { ChildControllers, Controller } from "@overnightjs/core";
import CartsController from "./carts/controller";
import ProductsController from "./products/controller";

@Controller("api/v1")
@ChildControllers([new CartsController(), new ProductsController()])
class V1Controller {}

export default V1Controller;
