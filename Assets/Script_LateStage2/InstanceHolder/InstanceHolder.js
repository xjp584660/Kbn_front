#pragma strict

public class InstanceHolder extends MonoBehaviour
{
    protected function Awake() : void
    {
        new FTEMgr();
        new MenuAccessorImpl();
    }
}