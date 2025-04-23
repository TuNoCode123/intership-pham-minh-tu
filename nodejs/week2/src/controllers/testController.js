class TestController {
  async test(req, res) {
    res.statusCode = 200;
    res.send("Hello Worldfdsafdasfdas!");
  }
}
export default new TestController();
