/*
 * ui.js
 * 役割: 画面表示とユーザーインターフェースの操作を担当
 * 依存: config.js（APP_CONFIG・UI_CONFIGを使用）
 * 被依存: app.js / chat.js
 *
 * 【設計方針】
 * ・画面の見た目や表示状態だけを担当する
 * ・AIとの通信や命令の実行処理は書かない
 * ・DOM操作をこのファイルに集約する
 * ・他のファイルから画面を操作するときは、原則このファイルの関数を使用する
 *
 * 【重要】
 * このファイルでは「何をするか」ではなく
 * 「それを画面上でどう表示するか」を扱う。
 *
 * 更新: 2026-09-22
 */


/* ============================================================
   内部状態
============================================================ */

let processingMessageElement = null;


/* ============================================================
   チャット表示
============================================================ */

/**
 * チャットにメッセージを追加する。
 *
 * role:
 *   "user"      ユーザーの発言
 *   "assistant" AIの返答
 */
function addChatMessage(text, role) {
  const chatArea = document.getElementById("chatArea");
  if (!chatArea) return null;

  const message = document.createElement("div");

  message.className = `message ${role}`;
  message.textContent = text;

  chatArea.appendChild(message);

  scrollChatToBottom();

  return message;
}


/**
 * ユーザーの発言を表示する。
 */
function showUserMessage(text) {
  return addChatMessage(text, "user");
}


/**
 * AIの返答を表示する。
 */
function showAssistantMessage(text) {
  return addChatMessage(text, "assistant");
}


/* ============================================================
   処理中表示
============================================================ */

/**
 * AIが処理中であることを画面に表示する。
 *
 * 実際の処理そのものは行わない。
 */
function showProcessingMessage() {
  removeProcessingMessage();

  processingMessageElement = addChatMessage(
    "処理中...",
    "assistant"
  );

  if (processingMessageElement) {
    processingMessageElement.dataset.processing = "true";
  }
}


/**
 * 処理中表示を削除する。
 */
function removeProcessingMessage() {
  if (!processingMessageElement) return;

  processingMessageElement.remove();
  processingMessageElement = null;
}


/* ============================================================
   入力欄
============================================================ */

/**
 * 入力欄から文字列を取得する。
 */
function getInputText() {
  const input = document.getElementById("messageInput");
  if (!input) return "";

  return input.value.trim();
}


/**
 * 入力欄を空にする。
 */
function clearInput() {
  const input = document.getElementById("messageInput");
  if (!input) return;

  input.value = "";
}


/**
 * 入力欄を有効/無効にする。
 */
function setInputEnabled(enabled) {
  const input = document.getElementById("messageInput");
  const button = document.getElementById("sendButton");

  if (input) {
    input.disabled = !enabled;
  }

  if (button) {
    button.disabled = !enabled;
  }
}


/* ============================================================
   チャットスクロール
============================================================ */

/**
 * チャットを一番下までスクロールする。
 */
function scrollChatToBottom() {
  const chatArea = document.getElementById("chatArea");
  if (!chatArea) return;

  chatArea.scrollTop = chatArea.scrollHeight;
}


/* ============================================================
   初期画面
============================================================ */

/**
 * アプリ起動時の初期表示を作る。
 */
function initializeUI() {
  const chatArea = document.getElementById("chatArea");
  if (!chatArea) return;

  chatArea.innerHTML = "";

  if (APP_CONFIG.initialMessage) {
    showAssistantMessage(APP_CONFIG.initialMessage);
  }

  setInputEnabled(true);
}


/* ============================================================
   処理状態
============================================================ */

/**
 * 処理開始時のUI状態にする。
 */
function setProcessingState(isProcessing) {
  if (isProcessing) {
    showProcessingMessage();

    if (UI_CONFIG.disableInputWhileProcessing) {
      setInputEnabled(false);
    }
  } else {
    removeProcessingMessage();
    setInputEnabled(true);
  }
}