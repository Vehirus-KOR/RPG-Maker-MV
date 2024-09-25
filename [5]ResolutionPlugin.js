//=============================================================================
//* ResolutionPlugin.js
//=============================================================================
/*:
 * @plugindesc 인게임 해상도를 변경합니다.
 * @author Vehirus-KOR
 * @help Plugin for RPG Maker MV
 */

(function() {
    var width = 1400;  // 원하는 해상도의 너비
    var height = 1080;  // 원하는 해상도의 높이

    SceneManager._screenWidth = width;
    SceneManager._screenHeight = height;
    SceneManager._boxWidth = width;
    SceneManager._boxHeight = height;

    var resizeWidth = width - window.innerWidth;
    var resizeHeight = height - window.innerHeight;
    
    window.moveBy(-resizeWidth / 2, -resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
})();
