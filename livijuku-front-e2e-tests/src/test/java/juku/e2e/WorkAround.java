package juku.e2e;

/**
 * Created by petrisi on 17.9.15.
 */
public class WorkAround {
    public enum Delay {
        SHORT(200),
        MEDIUM(1000),
        LONG(5000);

        private static final int SCALE = 1;
        private final int delay;

        Delay(int delay) {
            this.delay = delay;
        }

        public int getMilliSeconds() {
            return delay * SCALE;
        }
    }

    public static void sleep(Delay delay) {
        try {
            Thread.sleep(delay.getMilliSeconds());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
