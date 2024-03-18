const customHeroDAO = require("../src/repository/customHeroDAO");

const customHeroService = require("../src/service/customHeroService");

jest.mock("../src/repository/customHeroDAO");
jest.mock("../src/service/customHeroService");

describe('Get custom Hero by username Test', () => {
   
    beforeEach(() => customHeroDAO.getCustomHero.mockClear());
    beforeEach(() => customHeroDAO.updateCustomHero.mockClear());
    
    test('get hero by username', async () => {
        customHeroDAO.getCustomHero.mockReturnValue("Custom Hero");
        
        const res = await customHeroService.getCustomHero("Rumi");
        
        expect(customHeroDAO.getCustomHero).toHaveBeenCalledTimes(1);
  
        expect(res).toEqual("Custom Hero");
    })

    test('put hero by', async () => {
        let mockHero = {id : "1", username : "Rumi", heroName : "hero", backstory : "backstory", description : "description", alignment : "good", stats : "stats"}
        customHeroDAO.updateCustomHero.mockReturnValue("Success") ;
        
        const res = await customHeroService.putCustomHero(mockHero);
        
        expect(customHeroDAO.updateCustomHero).toHaveBeenCalledTimes(1);

        // calling the custom hero service should also trigger the validate functions within the service layer
        expect(customHeroService.checkHero).toHaveBeenCalledTimes(1);
        expect(customHeroService.isGoodBadOrNeutral).toHaveBeenCalledTimes(1);

        expect(res).toEqual("Success");
    })

});