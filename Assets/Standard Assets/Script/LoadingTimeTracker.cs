using System;
using UnityEngine;

namespace KBN {
    /// <summary>
    /// Singleton class to track time elapsed in the loading screen and send corresponding BI
    /// </summary>
    public class LoadingTimeTracker {
        #region fields
        private static LoadingTimeTracker instance = null;
        private bool isTracking = false;
        private double loadingStartTime;
        private double startConnectingTime;
        private double loadingEndTime;
        private bool hasBeenInterrupted;
        private bool hasPaused;
        private StartMode startMode;
        private SendBIDelegate sendBIDelegate;
        #endregion

        public enum StartMode {
            FirstStart,
            Restart,
        };

        public delegate void SendBIDelegate(
            StartMode startMode,
            float fullTime,
            float afterConnectTime,
            bool interrupted,
            bool hasPaused
        );

        #region private methods / properties
        // Empty private constructor for singleton
        private LoadingTimeTracker() {
        }

        private void Reset() {
            loadingStartTime = -1.0;
            startConnectingTime = -1.0;
            loadingEndTime = -1.0;
            hasBeenInterrupted = false;
            hasPaused = false;
            sendBIDelegate = null;
        }

        private void SendBIReport() {
            if (!DataValid || sendBIDelegate == null) {
                return;
            }
            sendBIDelegate(startMode, 
                           Convert.ToSingle(loadingEndTime - loadingStartTime),
                           Convert.ToSingle(loadingEndTime - startConnectingTime),
                           hasBeenInterrupted,
                           hasPaused);
        }

        private bool DataValid {
            get {
                return loadingStartTime >= 0.0
                    && startConnectingTime >= loadingStartTime
                    && loadingEndTime >= startConnectingTime;
            }
        }
        #endregion

        #region public methods / properties
        public static LoadingTimeTracker Instance {
            get {
                if (instance == null) {
                    instance = new LoadingTimeTracker();
                }
                return instance;
            }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is tracking.
        /// </summary>
        /// <value><c>true</c> if this instance is tracking; otherwise, <c>false</c>.</value>
        public bool IsTracking {
            get {
                return isTracking;
            }
        }

        /// <summary>
        /// Starts the tracking. Resets the data before starting.
        /// </summary>
        /// <param name="startMode">Start mode.</param>
        /// <param name="sendBIDelegate">Send BI delegate.</param>
        public void StartTracking(StartMode startMode, SendBIDelegate sendBIDelegate=null) {
            Reset();
            isTracking = true;
            this.startMode = startMode;
            this.sendBIDelegate = sendBIDelegate;
            loadingStartTime = Time.realtimeSinceStartup;
        }

        /// <summary>
        /// Raises the interrupt event.
        /// </summary>
        public void OnInterrupt() {
            if (!isTracking) {
                return;
            }
            hasBeenInterrupted = true;
        }

        /// <summary>
        /// Indicates that app has been paused
        /// </summary>
        public void OnAppPause() {
            if (!isTracking) {
                return;
            }
            hasPaused = true;
        }

        /// <summary>
        /// Raises the start connecting server event.
        /// </summary>
        public void OnStartConnectingServer() {
            if (!isTracking) {
                return;
            }
            startConnectingTime = Time.realtimeSinceStartup;
        }

        /// <summary>
        /// Ends the tracking and invoke delegate to send BI report.
        /// </summary>
        public void EndTracking() {
            if (!isTracking) {
                return;
            }
            isTracking = false;
            loadingEndTime = Time.realtimeSinceStartup;
            SendBIReport();
        }
        #endregion
    }
}
