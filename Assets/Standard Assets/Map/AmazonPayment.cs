using UnityEngine;
using System.Collections;

namespace KBN {
    public abstract class AmazonPayment {
        public static AmazonPayment instance { get; protected set; }
        public abstract void SetProductPackages(string JSONPackages);
    }
}