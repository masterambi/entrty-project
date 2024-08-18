import { ChildControllers, Controller } from "@overnightjs/core";
import ProductsController from "./products/controller";
import CartsController from "./carts/controller";

@Controller("api/v1")
@ChildControllers([new CartsController(), new ProductsController()])
class V1Controller {}

export default V1Controller;
