//=============================================================================
// EnemyStatusPlugin.js
//=============================================================================
/*:
 * @plugindesc 전투 화면에서 적의 이름, 체력 바, 마나 바를 표시합니다.
 * @author Vehirus-KOR
 * @help Plugin for RPG Maker MV
 */

function Window_TransparentEnemyStatus() {
    this.initialize.apply(this, arguments);
}

Window_TransparentEnemyStatus.prototype = Object.create(Window_Base.prototype);
Window_TransparentEnemyStatus.prototype.constructor = Window_TransparentEnemyStatus;

Window_TransparentEnemyStatus.prototype.initialize = function(enemySprite) {
    const width = 300; // 창 너비
    const height = this.fittingHeight(3); // 적 상태 표시 높이 (3줄)
    this._enemySprite = enemySprite; // 적 스프라이트 참조 저장
    this._enemy = enemySprite._battler; // 적 데이터 참조 저장
    const x = this.calculateWindowX(); // 적 스프라이트 중앙에 맞춘 x 좌표
    const y = this.calculateWindowY(); // 적 스프라이트 중앙에 맞춘 y 좌표
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.opacity = 0; // 창을 투명하게 설정
    this.refresh();
};

Window_TransparentEnemyStatus.prototype.calculateWindowX = function() {
    const width = 220;
    return this._enemySprite.x - width / 2; // 적 스프라이트 중앙에 맞춘 x 좌표
};

Window_TransparentEnemyStatus.prototype.calculateWindowY = function() {
    const height = this.fittingHeight(3);
    return this._enemySprite.y - height / 2; // 적 스프라이트 중앙에 맞춘 y 좌표
};

Window_TransparentEnemyStatus.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.x = this.calculateWindowX(); // 매 프레임마다 x 좌표 갱신
    this.y = this.calculateWindowY(); // 매 프레임마다 y 좌표 갱신
    this.refresh(); // 매 프레임마다 창 내용 갱신
};

Window_TransparentEnemyStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._enemy && this._enemy.isAlive()) {
        this.drawEnemyName(this._enemy.name(), 0, 0);
        this.drawEnemyHp(this._enemy, 0, this.lineHeight());
        this.drawEnemyMp(this._enemy, 0, this.lineHeight() * 2);
    }
};

Window_TransparentEnemyStatus.prototype.drawEnemyName = function(name, x, y) {
    this.drawText(name, x, y, 200);
};

Window_TransparentEnemyStatus.prototype.drawEnemyHp = function(enemy, x, y) {
    const width = 200;
    this.drawGauge(x, y, width, enemy.hpRate(), this.hpGaugeColor1(), this.hpGaugeColor2());
    this.drawText(enemy.hp + ' / ' + enemy.mhp, x, y, width, 'right');
};

Window_TransparentEnemyStatus.prototype.drawEnemyMp = function(enemy, x, y) {
    const width = 200;
    this.drawGauge(x, y, width, enemy.mpRate(), this.mpGaugeColor1(), this.mpGaugeColor2());
    this.drawText(enemy.mp + ' / ' + enemy.mmp, x, y, width, 'right');
};

Window_TransparentEnemyStatus.prototype.hpGaugeColor1 = function() {
    return this.textColor(20);
};

Window_TransparentEnemyStatus.prototype.hpGaugeColor2 = function() {
    return this.textColor(21);
};

Window_TransparentEnemyStatus.prototype.mpGaugeColor1 = function() {
    return this.textColor(22);
};

Window_TransparentEnemyStatus.prototype.mpGaugeColor2 = function() {
    return this.textColor(23);
};

//-----------------------------------------------------------------------------
// Scene_Battle modifications to include TransparentEnemyStatusWindow for each enemy
//-----------------------------------------------------------------------------

Scene_Battle.prototype.createTransparentEnemyStatusWindows = function() {
    this._enemyStatusWindows = [];
    this._spriteset._enemySprites.forEach(enemySprite => {
        const enemyStatusWindow = new Window_TransparentEnemyStatus(enemySprite);
        this.addChild(enemyStatusWindow);
        this._enemyStatusWindows.push(enemyStatusWindow);
    });
};

Scene_Battle.prototype.showEnemyStatusWindows = function(visible) {
    this._enemyStatusWindows.forEach(window => {
        window.visible = visible; // 창의 가시성 조절
    });
};

const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_createAllWindows.call(this);
    this.createTransparentEnemyStatusWindows(); // 각 적 스프라이트 중앙에 상태 창 생성
};

//-----------------------------------------------------------------------------
// 스킬 및 궁극 메뉴 처리
//-----------------------------------------------------------------------------

const _Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill;
Scene_Battle.prototype.commandSkill = function() {
    this.showEnemyStatusWindows(false); // 스킬 메뉴가 열릴 때 적 상태창 숨기기
    _Scene_Battle_commandSkill.call(this);
};

const _Scene_Battle_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
Scene_Battle.prototype.onSkillCancel = function() {
    this.showEnemyStatusWindows(true); // 스킬 메뉴 취소 시 적 상태창 다시 보이기
    _Scene_Battle_onSkillCancel.call(this);
};

const _Scene_Battle_commandUltimate = Scene_Battle.prototype.commandUltimate || Scene_Battle.prototype.commandSkill; // 궁극 메뉴 가정
Scene_Battle.prototype.commandUltimate = function() {
    this.showEnemyStatusWindows(false); // 궁극 메뉴가 열릴 때 적 상태창 숨기기
    _Scene_Battle_commandUltimate.call(this);
};

const _Scene_Battle_onUltimateCancel = Scene_Battle.prototype.onUltimateCancel || Scene_Battle.prototype.onSkillCancel;
Scene_Battle.prototype.onUltimateCancel = function() {
    this.showEnemyStatusWindows(true); // 궁극 메뉴 취소 시 적 상태창 다시 보이기
    _Scene_Battle_onUltimateCancel.call(this);
};
// 스킬을 선택한 후 적 스테이터스 창을 다시 보이도록 처리
const _Scene_Battle_onSkillOk = Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk = function() {
    _Scene_Battle_onSkillOk.call(this);
    this.showEnemyStatusWindows(true); // 스킬 선택 후 적 상태창 다시 보이기
};

// 궁극 스킬을 선택한 후 적 스테이터스 창을 다시 보이도록 처리 (궁극 메뉴가 존재한다고 가정)
const _Scene_Battle_onUltimateOk = Scene_Battle.prototype.onUltimateOk || Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onUltimateOk = function() {
    _Scene_Battle_onUltimateOk.call(this);
    this.showEnemyStatusWindows(true); // 궁극 스킬 선택 후 적 상태창 다시 보이기
};
