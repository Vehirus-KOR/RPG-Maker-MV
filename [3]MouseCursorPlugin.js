//=============================================================================
//* MouseCursorPlugin.js
//=============================================================================
/*:
 * @plugindesc 게임화면 내에서 마우스 커서를 커스텀 이미지로 변경합니다.
 * @author Vehirus-KOR
 * @help Plugin for RPG Maker MV
 */

(function() {
    const cursorImage = 'img/system/CustomCursor'; // 커서 이미지 경로
    let customCursorSprite;
    const trailDuration = 60; // 잔상이 유지되는 시간 (프레임 단위)
    const fadeSpeed = 0.5;   // 잔상이 점점 사라지는 속도
    const maxTrails = 3;     // 최대 잔상 개수
    let trails = [];          // 잔상을 저장할 배열

    // 마우스 커서를 투명화하는 함수
    function hideDefaultCursor() {
        document.body.style.cursor = 'none'; // 기본 마우스 커서 숨김
    }

    // 커스텀 커서 이미지를 생성하는 함수
    function createCustomCursor() {
        customCursorSprite = new Sprite(ImageManager.loadBitmap('', cursorImage));
        customCursorSprite.anchor.x = 0.5;  // 커서 중심을 설정
        customCursorSprite.anchor.y = 0.5;
        SceneManager._scene.addChild(customCursorSprite);
    }

    // 잔상을 생성하는 함수
    function createCursorTrail(x, y) {
        // 새로운 잔상 생성
        const trail = new Sprite(ImageManager.loadBitmap('', cursorImage));
        trail.x = x;
        trail.y = y;
        trail.anchor.x = 0.5;
        trail.anchor.y = 0.5;
        trail.opacity = 255; // 처음엔 불투명하게 설정
        SceneManager._scene.addChild(trail);
        trails.push(trail); // 잔상 배열에 추가

        // 잔상의 개수가 최대값을 넘으면 가장 오래된 잔상 제거
        if (trails.length > maxTrails) {
            const oldestTrail = trails.shift();
            SceneManager._scene.removeChild(oldestTrail); // 오래된 잔상 제거
        }

        // 잔상을 점점 투명하게 만들다가 제거하는 함수
        const fadeOutTrail = function() {
            trail.opacity -= fadeSpeed * 255;
            if (trail.opacity <= 0) {
                SceneManager._scene.removeChild(trail);
            }
        };

        // 일정 시간 후 잔상 제거
        const trailInterval = setInterval(function() {
            fadeOutTrail();
            if (trail.opacity <= 0) {
                clearInterval(trailInterval); // 잔상이 완전히 사라지면 정지
            }
        }, 1000 / 60); // 60프레임 기준
    }

    // 커서 위치를 화면 크기에 맞춰 보정하는 함수
    function getScaledMousePosition(event) {
        const scaleX = Graphics.width / window.innerWidth;   // X축 스케일링 비율
        const scaleY = Graphics.height / window.innerHeight; // Y축 스케일링 비율
        const mouseX = (event.pageX - Graphics._canvas.offsetLeft) * scaleX; // 스케일링된 X 좌표
        const mouseY = (event.pageY - Graphics._canvas.offsetTop) * scaleY;  // 스케일링된 Y 좌표
        return { x: mouseX, y: mouseY };
    }

    // 커스텀 커서의 위치를 마우스 위치로 업데이트하는 함수
    function updateCursorPosition(x, y) {
        customCursorSprite.x = x;  // 마우스 X 좌표
        customCursorSprite.y = y;  // 마우스 Y 좌표
        createCursorTrail(x, y);   // 잔상을 남김
    }

    // 마우스 움직임을 추적하는 이벤트 핸들러
    function trackMouseMovement() {
        document.onmousemove = function(event) {
            const { x: mouseX, y: mouseY } = getScaledMousePosition(event); // 스케일된 마우스 좌표 가져오기
            updateCursorPosition(mouseX, mouseY);  // 마우스 위치 업데이트
        };
    }

    // Scene_Base의 시작 시 커서를 숨기고, 커스텀 커서를 생성
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        hideDefaultCursor();  // 기본 커서 숨김
        createCustomCursor(); // 커스텀 커서 생성
        trackMouseMovement(); // 마우스 움직임 추적 시작
    };

})();
