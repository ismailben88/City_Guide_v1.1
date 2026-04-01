// components/home/ErrorMessage.jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <p className="error-message__text">⚠️ {message}</p>
      {onRetry && (
        <button className="error-message__btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
