/*
 * chat.js
 * 役割: 会話履歴の管理とAIとの通信フローを担当
 * 依存: config.js（APP_CONFIG・AI_CONFIG・UI_CONFIGを使用）
 *       ui.js（showUserMessage・showAssistantMessage・setProcessingState等を使用）
 * 被依存: app.js / command.js
 *
 * 【設計方針】
 * ・会話履歴の管理をこのファイルに集約する
 * ・画面表示そのものはui.jsに任せる
 * ・AIとの通信処理は、このファイルの境界から外へ漏らさない
 * ・AIサービスが変更されても、原則このファイルだけを変更すればよい構造にする
 * ・現段階ではAI接続先が未確定のため、通信部分は仮実装とする
 *
 * 【重要】
 * chat.jsは「会話」を管理する。
 *
 * 「ユーザーが何を命令したか」の判定はcommand.js、
 * 「命令を実際に実行する処理」はactions.jsが担当する。
 *
 * 更新: 2026-09-22
 */


/* ============================================================
   会話履歴
============================================================ */

let chatHistory = [];


/**
 * 会話履歴を初期化する。
 */
function initializeChat() {
  chatHistory = [];
}


/**
 * 会話履歴にメッセージを追加する。
 *
 * role:
 *   "user"
 *   "assistant"
 */
function addToChatHistory(role, content) {
  chatHistory.push({
    role: role,
    content: content
  });

  limitChatHistory();
}


/**
 * 会話履歴が大きくなりすぎないよう制限する。
 */
function limitChatHistory() {
  const maxMessages = APP_CONFIG.maxMessages;

  if (chatHistory.length <= maxMessages) {
    return;
  }

  chatHistory = chatHistory.slice(-maxMessages);
}


/**
 * 現在の会話履歴を取得する。
 *
 * 外部から直接chatHistoryを書き換えないため、
 * コピーを返す。
 */
function getChatHistory() {
  return [...chatHistory];
}


/* ============================================================
   メッセージ送信
============================================================ */

/**
 * ユーザーのメッセージを受け取って会話処理を開始する。
 */
async function sendChatMessage(text) {
  const message = text.trim();

  if (!message) {
    return;
  }

  showUserMessage(message);
  addToChatHistory("user", message);

  setProcessingState(true);

  try {
    const response = await requestAI(message);

    if (!response) {
      throw new Error("AIから有効な返答を取得できませんでした。");
    }

    addToChatHistory("assistant", response);
    showAssistantMessage(response);

    return response;

  } catch (error) {
    console.error("sendChatMessage error:", error);

    const errorMessage =
      "AIとの通信でエラーが発生しました。";

    addToChatHistory("assistant", errorMessage);
    showAssistantMessage(errorMessage);

    return null;

  } finally {
    setProcessingState(false);
  }
}


/* ============================================================
   AI通信
============================================================ */

/**
 * AIへリクエストを送る。
 *
 * 【重要】
 * 現在はAI接続先が未設定なので仮実装。
 *
 * 実際のAIサービスを決定した段階で、
 * 原則この関数を変更する。
 */
async function requestAI(userMessage) {

  if (!AI_CONFIG.provider || !AI_CONFIG.endpoint) {
    return createTemporaryAIResponse(userMessage);
  }

  /*
   * 実際のAPI接続はここに実装する。
   *
   * 例:
   *   fetch(AI_CONFIG.endpoint, ...)
   *
   * ただしAPI仕様が確定するまでは書かない。
   */

  throw new Error("AI接続処理が未実装です。");
}


/* ============================================================
   仮AI
============================================================ */

/**
 * AI接続前の動作確認用。
 *
 * 【設計方針】
 * AIがまだ接続されていなくても、
 * チャットUIと会話フローだけは動作確認できるようにする。
 */
function createTemporaryAIResponse(userMessage) {
  return `受け取りました：「${userMessage}」`;
}


/* ============================================================
   会話リセット
============================================================ */

/**
 * 会話履歴を削除する。
 */
function clearChatHistory() {
  initializeChat();
}