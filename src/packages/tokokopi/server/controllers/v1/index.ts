import { ChildControllers, Controller } from "@overnightjs/core";
import UsersController from "./users/controller";
import ProductsController from "./products/controller";

@Controller("api/v1")
@ChildControllers([new UsersController(), new ProductsController()])
class V1Controller {}

export default V1Controller;
