const apiHeroDao = require('../src/repository/apiHeroDAO');
const apiHeroService = require("../src/service/apiHeroService");

jest.mock("../src/repository/apiHeroDAO")
jest.mock("../src/util/validate")
jset.mock("../src/service/apiHeroService");

describe('Get API Hero by Hero ID Test', () => {
   
    beforeEach(() => apiHeroDao.getApiHero.mockClear());
    
    test('get hero by hero id', async () => {
        apiHeroDao.getApiHero.mockReturnValue("Hero");
        
        const res = await apiHeroService.getApiHero("1");
        
        expect(apiHeroDao.getApiHero).toHaveBeenCalledTimes(1);
  
        expect(res).toEqual("Hero");
    })

});